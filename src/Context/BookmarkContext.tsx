import { ReactNode, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { TBookmark } from "../Utils/types";

type TAddBookmark = ({
  word,
  partOfSpeech,
  definition,
}: {
  word: string;
  partOfSpeech: string;
  definition: string;
}) => void;

type TDeleteBookmark = ({
  word,
  partOfSpeech,
}: {
  word: string;
  partOfSpeech: string;
}) => void;

type TIsBookmarked = ({
  word,
  partOfSpeech,
}: {
  word: string;
  partOfSpeech: string;
}) => boolean;

type TBookmarkContextValues = {
  addBookmark: TAddBookmark;
  deleteBookmark: TDeleteBookmark;
  isBookmarked: TIsBookmarked;
  loggedInUserBookmarks: TBookmark[];
};

const BookmarkContext = createContext<TBookmarkContextValues | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { updateLoggedInUser, loggedInUserData } = useAuth();
  const loggedInUserBookmarks = loggedInUserData?.bookmarks || [];

  const addBookmark: TAddBookmark = ({ word, partOfSpeech, definition }) => {
    const newBookmark: TBookmark = {
      word,
      partOfSpeech,
      dateCreated: new Date(),
      definition,
    };

    updateLoggedInUser((current) => {
      const oldBookmarks = current.bookmarks || [];
      return { ...current, bookmarks: [...oldBookmarks, newBookmark] };
    });
  };

  const deleteBookmark: TDeleteBookmark = ({ word, partOfSpeech }) => {
    updateLoggedInUser((current) => {
      const bookmarksWithoutTarget = current.bookmarks.filter(
        (item) => item.word !== word || item.partOfSpeech !== partOfSpeech
      );

      return { ...current, bookmarks: bookmarksWithoutTarget };
    });
  };

  const isBookmarked: TIsBookmarked = ({ word, partOfSpeech }) => {
    return loggedInUserBookmarks.some((bookmark) => {
      return bookmark.word === word && bookmark.partOfSpeech === partOfSpeech;
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        addBookmark,
        deleteBookmark,
        isBookmarked,
        loggedInUserBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context)
    throw new Error("useBookmark must be used inside of it's Provider's scope");
  return context;
}
