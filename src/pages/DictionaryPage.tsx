import { useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IoSearchOutline } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { searchDictionary } from "@/services/dictionaryService";
import { useFavorites } from "@/context/FavoritesContext";

interface DictionaryPageProps {
  onBack: () => void;
}

const DictionaryPage = ({ onBack }: DictionaryPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const results = useMemo(() => searchDictionary(searchTerm), [searchTerm]);

  const speakWord = (word: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "yo-NG";

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <Button
        label="Back to translator"
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        onClick={onBack}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <FaBookOpen className="text-4xl text-green-700" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Yoruba Dictionary
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          Discover Yoruba words, meanings, and pronunciation.
        </p>
      </div>

      <div className="relative mb-6">
        <IoSearchOutline className="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 text-xl text-gray-400" />

        <InputText
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search a Yoruba word or English meaning..."
          aria-label="Search the Yoruba dictionary"
          className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 shadow-sm"
        />

        {searchTerm && (
          <Button
            icon="pi pi-times"
            text
            rounded
            severity="secondary"
            aria-label="Clear search"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          {searchTerm.trim() ? "Search results" : "Explore the dictionary"}
        </h2>

        <span className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? "word" : "words"}
        </span>
      </div>

      {!searchTerm.trim() ? (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <div className="py-6 text-center">
            <IoSearchOutline className="mx-auto mb-3 text-4xl text-gray-300" />

            <p className="font-medium text-gray-800">Find a Yoruba word</p>

            <p className="mt-2 text-sm text-gray-500">
              Search in Yoruba or English to discover meanings.
            </p>
          </div>
        </Card>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map((entry) => (
            <Card
              key={entry.id}
              className="rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="break-words text-xl font-semibold text-gray-900">
                    {entry.word}
                  </h3>

                  {entry.partOfSpeech && (
                    <span className="mt-1 inline-block text-sm italic text-gray-500">
                      {entry.partOfSpeech}
                    </span>
                  )}

                  <p className="mt-2 break-words text-base text-gray-700">
                    {entry.meanings.en}
                  </p>

                  {entry.examples?.map((example, index) => (
                    <div
                      key={`${entry.id}-example-${index}`}
                      className="mt-3 border-l-2 border-green-200 pl-3"
                    >
                      <p className="text-sm text-gray-800">{example.yoruba}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {example.english}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {/* <Button
                    icon="pi pi-volume-up"
                    rounded
                    text
                    severity="secondary"
                    aria-label={`Pronounce ${entry.word}`}
                    tooltip="Listen to pronunciation"
                    onClick={() => speakWord(entry.word)}
                  /> */}

                  <Button
                    icon={
                      isFavorite(entry.id)
                        ? "pi pi-bookmark-fill"
                        : "pi pi-bookmark"
                    }
                    rounded
                    text
                    severity={isFavorite(entry.id) ? "danger" : "secondary"}
                    aria-label={
                      isFavorite(entry.id)
                        ? `Remove ${entry.word} from saved words`
                        : `Save ${entry.word}`
                    }
                    tooltip={
                      isFavorite(entry.id)
                        ? "Remove from saved words"
                        : "Save word"
                    }
                    onClick={() => toggleFavorite(entry.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <div className="py-6 text-center">
            <IoSearchOutline className="mx-auto mb-3 text-4xl text-gray-300" />

            <p className="font-medium text-gray-800">No words found</p>

            <p className="mt-2 text-sm text-gray-500">
              Try another spelling or search using an English meaning.
            </p>

            <Button
              label="Clear search"
              icon="pi pi-times"
              outlined
              severity="secondary"
              onClick={() => setSearchTerm("")}
              className="mt-4"
            />
          </div>
        </Card>
      )}
    </section>
  );
};

export default DictionaryPage;
