import React from "react";
import Stores from "../stores";
import { storeContext } from "../context";

const useStores = (): Stores => {
  return React.useContext(storeContext) as Stores;
};

export default useStores;
