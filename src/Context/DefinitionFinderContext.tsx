import axios, { AxiosError, AxiosResponse } from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { useMutation } from "react-query";
import { TDictionaryErrorResponse, TDictionaryResponse } from "../Utils/types";
import { useLoader } from "./LoaderContext";

type TSearchDefinition = (
  word: string,
  callback?: (data?: AxiosResponse<TDictionaryResponse, unknown>) => void
) => void;

type TDefinitionFinderContextValues = {
  handleSearch: TSearchDefinition;
  definitionList?: TDictionaryResponse;
  handleFindSynonym: (word: string) => void;
  errorMessage?: TDictionaryErrorResponse;
};

const DefinitionFinderContext =
  createContext<TDefinitionFinderContextValues | null>(null);

const getDefinition = (word: string) => {
  return axios.get<TDictionaryResponse>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word || "***"}`
  );
};

const getSynonyms = (words: string[]) => {
  return Promise.allSettled(words.map((word) => getDefinition(word)));
};

const retrieveAllSynonyms = (data: TDictionaryResponse) => {
  // to make things simple, we're only considering first result
  const fetchData = data[0];
  return fetchData.meanings.flatMap((meaning) => {
    return meaning.synonyms;
  });
};

export function DefinitionFinderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { startLoading, completeLoading } = useLoader();
  const [isFetchingSynonyms, setIsFetchingSynonyms] = useState(false);

  const [errorMessage, setErrorMessage] = useState<
    TDictionaryErrorResponse | undefined
  >();

  const [definitionList, setDefinitionList] = useState<TDictionaryResponse>([]);

  const definition = useMutation(getDefinition, {
    onMutate() {
      startLoading();
    },
    onSuccess(data) {
      setErrorMessage(undefined);
      const definitionData = data.data;
      if (isFetchingSynonyms) return;
      setDefinitionList(definitionData);
    },
    onError(error: AxiosError) {
      const errorMessage = error.response?.data as TDictionaryErrorResponse;
      setDefinitionList([]);
      setErrorMessage(errorMessage);
    },
    onSettled() {
      completeLoading();
    },
  });

  const synonyms = useMutation(getSynonyms, {
    onMutate() {
      startLoading();
    },
    onSuccess(data) {
      setErrorMessage(undefined);
      const synonymList = data
        .filter((item) => item.status === "fulfilled")
        .flatMap((item) => {
          if (item.status !== "fulfilled") return;
          return item.value.data;
        });
      if (!synonymList || synonymList.length === 0) {
        setErrorMessage({
          title: "No Synomyns Found",
          message:
            "Looks like the word you searched does not contain a synonym in our database",
          resolution: "",
        });
        setDefinitionList([]);
        return;
      }
      setDefinitionList(synonymList as TDictionaryResponse);
    },
    onError(error: AxiosError) {
      const errorMessage = error.response?.data as TDictionaryErrorResponse;
      setDefinitionList([]);
      setErrorMessage(errorMessage);
    },
    onSettled() {
      completeLoading();
    },
  });

  const handleSearch: TSearchDefinition = (word, callback) => {
    setIsFetchingSynonyms(false);
    definition.mutate(word, {
      onSettled(data) {
        if (!callback) return;
        callback(data);
      },
    });
  };

  const handleFindSynonym = async (word: string) => {
    setIsFetchingSynonyms(true);
    definition.mutate(word, {
      onSuccess(data) {
        const synonymList = retrieveAllSynonyms(data.data);
        synonyms.mutate(synonymList);
      },
    });
  };

  return (
    <DefinitionFinderContext.Provider
      value={{ handleSearch, definitionList, errorMessage, handleFindSynonym }}
    >
      {children}
    </DefinitionFinderContext.Provider>
  );
}

export function useDefinitionFinder() {
  const context = useContext(DefinitionFinderContext);
  if (!context)
    throw new Error(
      "useDefinitionFinder must be used inside of it's Provider's scope"
    );
  return context;
}
