import React from "react";
import { observer } from "mobx-react-lite";
import useStores from "../../hooks/useStores";
import UnhandledErrorModalView from "./UnhandledErrorModal_View";

const UnhandledErrorModal: React.FC = () => {
  const { uiStore } = useStores();

  return (
    <UnhandledErrorModalView
      isShown={!!uiStore.unhandledError}
      onClose={uiStore.clearUnhandledError}
      error={uiStore.unhandledError}
    />
  );
};

export default observer(UnhandledErrorModal);
