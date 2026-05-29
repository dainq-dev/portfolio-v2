import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

export function App() {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<div className="loading-screen"><div className="loading-bar"></div></div>}>
          <MainContainer>
            <Suspense fallback={null}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
}
