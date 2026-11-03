import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useFavorites } from "@/context/FavoritesContext";
import yorubaWords from "@/data/yoruba-words.json";
import type { DictionaryEntry } from "@/types/dictionary";

const dictionary = yorubaWords as DictionaryEntry[];

interface FavoritesPageProps {
  onBack: () => void;
}

const FavoritesPage = ({ onBack }: FavoritesPageProps) => {
  const { favoriteIds, removeFavorite, clearFavorites } = useFavorites();
  const [search, setSearch] = useState("");

  const savedWords = useMemo(() => {
    return dictionary
      .filter((entry) => favoriteIds.includes(entry.id))
      .filter((entry) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return (
          entry.word.toLowerCase().includes(query) ||
          entry.normalized.toLowerCase().includes(query) ||
          entry.meanings.en.toLowerCase().includes(query)
        );
      });
  }, [favoriteIds, search]);

  return (
    <section className="space-y-6">
      <Button
        label="Back to translator"
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        onClick={onBack}
        className="mb-6"
      />
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Words</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of Yoruba words you want to learn.
          </p>
        </div>

        {favoriteIds.length > 0 && (
          <Button
            label="Clear all"
            icon="pi pi-trash"
            severity="danger"
            text
            onClick={clearFavorites}
          />
        )}
      </div>

      {/* Search */}
      {favoriteIds.length > 0 && (
        <div className="w-full sm:max-w-md">
          <span className="p-input-icon-left w-full">
            {/* <i className="pi pi-search" /> */}
            <InputText
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search saved words..."
              className="w-full"
            />
          </span>
        </div>
      )}

      {/* Saved words */}
      {favoriteIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <i className="pi pi-bookmark text-2xl text-gray-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No saved words yet
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            When you find a Yoruba word you want to remember, save it from the
            dictionary and it will appear here.
          </p>
        </div>
      ) : savedWords.length === 0 ? (
        <div className="rounded-xl border border-gray-200 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No saved words match "{search}".
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {savedWords.length} of {favoriteIds.length} saved words
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedWords.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {entry.word}
                    </h2>

                    {entry.pronunciation && (
                      <p className="mt-1 text-sm text-gray-500">
                        {entry.pronunciation}
                      </p>
                    )}
                  </div>

                  <Button
                    icon="pi pi-bookmark-fill"
                    rounded
                    text
                    severity="danger"
                    aria-label={`Remove ${entry.word} from saved words`}
                    tooltip="Remove from saved words"
                    onClick={() => removeFavorite(entry.id)}
                  />
                </div>

                <p className="mt-4 text-gray-700">{entry.meanings.en}</p>

                {entry.partOfSpeech && (
                  <span className="mt-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    {entry.partOfSpeech}
                  </span>
                )}

                {entry.examples && entry.examples.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Example
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {entry.examples[0].yoruba}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {entry.examples[0].english}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FavoritesPage;
