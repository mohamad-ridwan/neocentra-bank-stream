import React from "react";
import { Provider } from "react-redux";
import { store } from "shared_remote/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "shared_remote/apiHelper";
import { TooltipProvider } from "shared_remote/Tooltip";

interface MfeProvidersProps {
  children: React.ReactNode;
}

export default function MfeProviders({
  children,
}: Readonly<MfeProvidersProps>) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}
