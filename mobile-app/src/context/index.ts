import React from "react";
import Stores from "../stores";

export const storeContext = React.createContext<Stores>({} as Stores);
