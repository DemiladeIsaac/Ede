import { FaBookOpen, FaRegHeart } from "react-icons/fa";
import { Card } from "primereact/card";
import { RiTranslate2 } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import TranslatorPanel from "@/components/TranslatorPanel";
import { useState } from "react";
import DictionaryPage from "./DictionaryPage";
import FavoritesPage from "./FavoritesPage";

type ActivePage = "translator" | "dictionary" | "favorites";

const HomePage = () => {
  const [activePage, setActivePage] = useState<ActivePage>("translator");

  const navigationItems = [
    {
      id: "translator" as const,
      label: "Translate",
      icon: <RiTranslate2 className="mx-auto text-2xl" />,
    },
    {
      id: "dictionary" as const,
      label: "Dictionary",
      icon: <IoSearchOutline className="mx-auto text-2xl" />,
    },
    {
      id: "favorites" as const,
      label: "Saved words",
      icon: <FaRegHeart className="mx-auto text-2xl" />,
    },
  ];

  return (
    <div className="font-inter max-w-280 mx-auto mt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-3xl">
          <FaBookOpen />
          <p>Èdè</p>
        </div>
        <p>Yoruba language companion</p>
      </div>
      <section className="mt-4 grid">
        {navigationItems.map((item) => (
          <div
            className="col-12 lg:col-6 xl:col-4"
            key={item.id}
            onClick={() => setActivePage(item.id)}
          >
            <Card
              className={`cursor-pointer text-center transition-colors ${
                activePage === item.id
                  ? "border border-green-200 bg-green-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <p className="mt-2 text-lg font-medium">{item.label}</p>
            </Card>
          </div>
        ))}
      </section>
      <section className="mt-4">
        {activePage === "translator" && <TranslatorPanel />}
        {activePage === "dictionary" && (
          <DictionaryPage onBack={() => setActivePage("translator")} />
        )}
        {activePage === "favorites" && (
          <FavoritesPage onBack={() => setActivePage("translator")} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
