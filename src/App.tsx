import { Refine } from "@refinedev/core";
import { ThemedLayoutV2, ErrorComponent, RefineThemes } from "@refinedev/mui";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";

import dataProvider from "@refinedev/simple-rest";
import routerProvider, { DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ContaCreate, ContaEdit, ContaList, ContaShow, Dashboard } from 'pages';



const API_URL = "http://localhost:8080/api";
function App() {
  
  return (
    <div>
        <ThemeProvider theme={RefineThemes.Blue}>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <BrowserRouter>
                <Refine
                    routerProvider={routerProvider}
                    dataProvider={dataProvider(API_URL)}
                    resources={[
                      {
                        name: "dashboards",
                        list: Dashboard
                      },
                      {
                        name:"contas",
                        list: ContaList,
                        show: ContaShow,
                        create: ContaCreate,
                        edit: ContaEdit,
                      },
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                      reactQuery: {
                        devtoolConfig: false
                      }
                    }}
                >
                    <Routes>
                            <Route
                                element={
                                    <ThemedLayoutV2>
                                        <Outlet />
                                    </ThemedLayoutV2>
                                }
                            >
                                <Route
                                    index
                                    element={
                                        <NavigateToResource resource="/" />
                                    }
                                />
                                <Route path="/dashboards" element={<Dashboard />} />
                                <Route path="/contas" element={<ContaList />} />
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier />
                        <DocumentTitleHandler />
                </Refine>
            </BrowserRouter>
        </ThemeProvider>
    </div>
  );
}

export default App;
