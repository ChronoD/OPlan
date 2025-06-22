import { ReactNode, createContext, useReducer } from "react";
import { Actions } from "./actions";
import { initialState, reducer } from ".";
import { OPlanState } from "./types";

// Define the type for your context data
type TabContextType = {
  state: OPlanState[];
  dispatch: React.Dispatch<Actions>;
};

// Create the context with an initial value of null
export const TabContext = createContext<TabContextType | null>(null);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

// Define the provider component
function TabContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TabContext.Provider value={{ state, dispatch }}>
      {children}
    </TabContext.Provider>
  );
}

export default TabContextProvider;
