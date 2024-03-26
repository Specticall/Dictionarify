import { MouseEventHandler, useState } from "react";
import { useBookmark } from "../Context/BookmarkContext";
import { capitalize } from "../Utils/helper";
import { useDefinitionFinder } from "../Context/DefinitionFinderContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Bookmark() {
  const [searchValue, setSearchValue] = useState("");
  const { loggedInUserData } = useAuth();

  return (
    <main className="pt-48 max-w-[75rem] mx-auto px-6">
      <BookmarkHeading setSearchValue={setSearchValue} />
      {loggedInUserData ? (
        <BookmarkList searchValue={searchValue} />
      ) : (
        <BookmarkNoUserLoggedIn />
      )}
    </main>
  );
}

function BookmarkNoUserLoggedIn() {
  return (
    <div className="mt-12 border-t-[1px] border-border pt-24">
      <h2 className="text-[1.75rem] text-center text-main font-medium">
        Log into your account
      </h2>
      <p className="text-light text-center max-w-[20rem] mx-auto leading-8 mt-4">
        Login to your account to use bookmarks. Sign up or create one today for
        free!
      </p>
    </div>
  );
}

function BookmarkHeading({
  setSearchValue,
}: {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { loggedInUserBookmarks } = useBookmark();
  const bookmarkCount = loggedInUserBookmarks.length;
  return (
    <div className="flex items-center justify-start md:flex-col md:gap-8">
      <div className="flex gap-2">
        <h1 className="text-title text-main font-medium leading-8">
          Bookmarks
        </h1>
        <p className="text-body text-light">{`${
          bookmarkCount < 10 && bookmarkCount > 0 ? 0 : ""
        }${bookmarkCount}`}</p>
      </div>
      <div className="flex gap-6 flex-1 justify-end">
        <div className="relative w-full max-w-[23rem]">
          <input
            type="text"
            placeholder="Find Bookmark"
            className="bg-white shadow-lg shadow-accent/10 rounded-full px-10 py-5 w-full"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <i className="bx bx-search absolute top-[50%] translate-y-[-50%] right-[2rem] text-heading"></i>
        </div>
      </div>
    </div>
  );
}

function BookmarkList({ searchValue }: { searchValue: string }) {
  const { loggedInUserBookmarks, deleteBookmark } = useBookmark();
  const { handleSearch } = useDefinitionFinder();
  const navigate = useNavigate();

  const handleGoToDefinition: (
    word: string
  ) => MouseEventHandler<HTMLLIElement> = (word: string) => (e) => {
    if ((e.target as HTMLLIElement).closest(".delete")) return;
    handleSearch(word, () => {
      navigate("/app/home");
    });
  };
  return (
    <ul className="mt-12 border-t-[1px] border-border">
      {loggedInUserBookmarks.length > 0 ? (
        loggedInUserBookmarks
          .filter(
            (bookmark) =>
              bookmark.word.includes(searchValue) ||
              bookmark.partOfSpeech.includes(searchValue)
          )
          .map((item, index) => {
            return (
              <li
                className="flex items-center justify-between py-8 border-b-[1px] border-border px-6 hover:bg-accent/5 cursor-pointer"
                onClick={handleGoToDefinition(item.word)}
              >
                <div className="flex gap-6 items-center">
                  <p className="text-light">
                    {`${index < 10 ? 0 : ""}${index + 1}`}.
                  </p>
                  <h3 className=" text-main font-medium">
                    {capitalize(item.word)}
                  </h3>
                  <div className="text-white bg-accent px-6 py-1 rounded-full mr-8">
                    {capitalize(item.partOfSpeech)}
                  </div>
                  <p className="text-light">{item.definition}</p>
                </div>
                <i
                  className="bx bx-x text-[1.75rem] text-light hover:text-red-500 cursor-pointer delete"
                  onClick={() =>
                    deleteBookmark({
                      word: item.word,
                      partOfSpeech: item.partOfSpeech,
                    })
                  }
                ></i>
              </li>
            );
          })
      ) : (
        <BookmarkEmpty />
      )}
    </ul>
  );
}

function BookmarkEmpty() {
  return (
    <>
      <h2 className="mt-24 text-[1.75rem] text-center text-main font-medium">
        You Don't Have Any Bookmarks
      </h2>
      <p className="text-light text-center max-w-[20rem] mx-auto leading-8 mt-4">
        Add bookmarks by clicking on the icon on the top left of search result
        definitions.
      </p>
    </>
  );
}
