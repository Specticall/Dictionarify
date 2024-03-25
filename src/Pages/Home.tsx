import { useState } from "react";
import Button from "../Components/Common/Button";
import SearchBar from "../Components/SearchBar";
import { useDefinitionFinder } from "../Context/DefinitionFinderContext";
import { TDefinition, TMeaning, TWord } from "../Utils/types";
import { capitalize } from "../Utils/helper";
import { DEFINITION_DISPLAY_SIZE } from "../Utils/config";
import { useBookmark } from "../Context/BookmarkContext";

export default function DefinitionFinder() {
  return (
    <main className="mx-auto max-w-[75rem] mt-[16rem] px-6">
      <Hero />
      <DefinitionList />
    </main>
  );
}

function Hero() {
  const [searchValue, setSearchValue] = useState("");
  const { handleSearch, handleFindSynonym } = useDefinitionFinder();

  return (
    <section className="text-center flex flex-col items-center justify-center font-medium">
      <h1
        className="text-title max-w-[55rem] leading-[120%]
      "
      >
        Type in the word you're looking for. We'll{" "}
        <span className="text-accent">handle</span> the rest.
      </h1>

      <p className="text-center text-light max-w-[25rem] leading-[200%] mt-6 text-body">
        Dictionarify offers a modern approach to dictionary browsing,
        eliminating any unnecessary hassle
      </p>
      <div className="relative mt-6 max-w-[30rem] w-full">
        <SearchBar onChange={setSearchValue} />
        <i className="bx bx-search absolute top-[50%] right-6 translate-y-[-50%] text-xl"></i>
      </div>
      <div className="mt-8 flex gap-4">
        <Button style="accent" onClick={() => handleSearch(searchValue)}>
          Search
        </Button>
        <Button style="dark" onClick={() => handleFindSynonym(searchValue)}>
          Find Synonym
        </Button>
      </div>
    </section>
  );
}

const retrieveImportantData = (definition: TWord) => {
  const commonData = {
    word: definition.word,
    phonetic:
      definition.phonetics.find((phonetic) => phonetic.text)?.text || "",
  };

  return definition.meanings.map((data) => {
    return {
      ...data,
      ...commonData,
    };
  });
};

function DefinitionList() {
  const { definitionList, errorMessage } = useDefinitionFinder();
  if (errorMessage) {
    return (
      <section className="mt-16 mb-32 ">
        <p className="text-light mb-4 text-body">Result (0)</p>
        <div className="border-t-[1px] border-border pb-12"></div>
        <div className="text-center">
          <h2 className="text-[2rem] text-main font-medium mt-16">
            {errorMessage.title}
          </h2>
          <p className="text-light text-body mt-2 max-w-[30rem] mx-auto leading-6">
            {errorMessage.message} {errorMessage.resolution}
          </p>
        </div>
      </section>
    );
  }

  if (!definitionList || definitionList.length === 0)
    return (
      <section className="mt-16 mb-32 ">
        <p className="text-light mb-4 text-body">Result (0)</p>
        <div className="border-t-[1px] border-border pb-12"></div>
        <div className="text-center">
          <h2 className="text-[2rem] text-main font-medium mt-16 max-w-[25rem] mx-auto">
            You Haven't Searched For Anything Yet.
          </h2>
          <p className="text-light text-body mt-2 max-w-[30rem] mx-auto leading-6">
            Type in the word you want to search and press the search button
          </p>
        </div>
      </section>
    );

  const formattedDataList = definitionList.flatMap((definition) =>
    retrieveImportantData(definition)
  );

  return (
    <section className="mt-16">
      <p className="text-light mb-4 text-body">
        Result ({formattedDataList.length || 0})
      </p>
      <div className="border-t-[1px] border-border pb-12"></div>
      {formattedDataList.map((definition, index) => {
        return (
          <Definition
            definitionData={definition}
            index={index + 1}
            key={`definition-key-${index}-${definition.word}-${definition.partOfSpeech}`}
          />
        );
      })}
    </section>
  );
}

function Definition({
  definitionData,
  index,
}: {
  definitionData: TMeaning & { word: string; phonetic: string };
  index: number;
}) {
  const { isBookmarked, addBookmark, deleteBookmark } = useBookmark();

  const [bookmarked, setBookmarked] = useState(() => {
    return isBookmarked({
      word: definitionData.word,
      partOfSpeech: definitionData.partOfSpeech,
    });
  });
  const [expand, setExpand] = useState(false);
  const definitionFirstPart = definitionData.definitions.slice(
    0,
    DEFINITION_DISPLAY_SIZE
  );
  const definitionSecondPart = definitionData.definitions.slice(
    DEFINITION_DISPLAY_SIZE
  );

  const handleToggleExpand = () => {
    setExpand((cur) => !cur);
  };

  return (
    <article className="grid grid-cols-[2rem,_1fr] gap-x-4 items-center pb-6 mb-16">
      <div className="text-heading text-light">
        {index < 10 ? `0${index}` : index}.
      </div>
      <div>
        <div className="flex-1 flex items-baseline gap-4">
          <h2 className="text-title">{capitalize(definitionData.word)}</h2>
          <p className="text-accent text-heading font-medium">
            {capitalize(definitionData.partOfSpeech)}
          </p>
          <div className="flex-1 w-full flex items-center justify-end">
            {bookmarked ? (
              <i
                className="bx bxs-bookmark text-[1.75rem] text-accent"
                onClick={() => {
                  deleteBookmark({
                    word: definitionData.word,
                    partOfSpeech: definitionData.partOfSpeech,
                  });
                  setBookmarked(false);
                }}
              ></i>
            ) : (
              <i
                className="bx bx-bookmark text-[1.75rem] hover:opacity-60 cursor-pointer"
                onClick={() => {
                  addBookmark({
                    word: definitionData.word,
                    partOfSpeech: definitionData.partOfSpeech,
                    definition:
                      definitionData.definitions.find(
                        (definition) => definition.definition !== ""
                      )?.definition || "Definition",
                  });
                  setBookmarked(true);
                }}
              ></i>
            )}
          </div>
        </div>
      </div>
      <div></div>
      {definitionData.phonetic ? (
        <p className="border-[1px] border-main rounded-full px-8 py-2 w-fit items-center justify-center gap-3 text-heading flex mt-4 mb-12">
          <i className="bx bxs-volume-full"></i>
          <p className="text-body">{definitionData.phonetic}</p>
        </p>
      ) : (
        <div className="mt-10"></div>
      )}
      {definitionFirstPart.map((item, index) => {
        return (
          <DefinitionItem
            item={item}
            index={index}
            key={`definition's-denifition-${index}`}
          />
        );
      })}
      {definitionSecondPart.length > 0 && (
        <>
          {expand &&
            definitionSecondPart.map((item, index) => {
              return (
                <DefinitionItem
                  item={item}
                  index={DEFINITION_DISPLAY_SIZE + index}
                  key={`definition's-denifition-${
                    DEFINITION_DISPLAY_SIZE + index
                  }`}
                />
              );
            })}
          <div></div>
          <p
            className="text-light underline hover:text-black cursor-pointer"
            onClick={handleToggleExpand}
          >
            {expand
              ? `Show less`
              : `Show ${definitionSecondPart.length} more definitions`}
          </p>
        </>
      )}
    </article>
  );
}

function DefinitionItem({ item, index }: { item: TDefinition; index: number }) {
  return (
    <>
      <div></div>
      <div className="border-b-[1px] border-border mb-8">
        <p className="">
          {index + 1}. {item.definition}
        </p>
        <p className="text-light mt-2 mb-8">
          {item.example && <p>e.g. {item.example}</p>}
        </p>

        <div className="">
          {item.antonyms.length > 0 && <AntonymList antonyms={item.antonyms} />}
          {item.synonyms.length > 0 && <SynonymList synonyms={item.synonyms} />}
        </div>
      </div>
    </>
  );
}

function SynonymList({ synonyms }: { synonyms: TDefinition["synonyms"] }) {
  const { handleSearch } = useDefinitionFinder();
  return (
    <div className="flex gap-4 items-center mb-8 flex-wrap">
      <p>Synonym ({synonyms.length})</p>
      <>
        {synonyms.map((synonym, index) => {
          return (
            <Button
              className="flex gap-2 items-center whitespace-nowrap"
              style="gray"
              key={`${synonym}-synonym-${index}`}
              onClick={() => handleSearch(synonym)}
            >
              <p>{capitalize(synonym)}</p>
              <i className="bx bx-chevron-right text-heading"></i>
            </Button>
          );
        })}
      </>
    </div>
  );
}

function AntonymList({ antonyms }: { antonyms: TDefinition["antonyms"] }) {
  return (
    <div className="flex gap-4 items-center mb-8 flex-wrap">
      <p>Antonym ({antonyms.length})</p>
      <>
        {antonyms.map((antonym, index) => {
          return (
            <Button
              className="flex gap-2 items-center whitespace-nowrap"
              style="gray"
              key={`${antonym}-antonym-${index}`}
            >
              <p>{capitalize(antonym)}</p>
              <i className="bx bx-chevron-right text-heading"></i>
            </Button>
          );
        })}
      </>
    </div>
  );
}
