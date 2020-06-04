import React from "react";
import { render, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
import axiosMock from "axios";
import App from "../Editor";
import { Server } from "../../../server/server";
import { ServerImpl } from "../../../server/server_impl";

var server: Server;
beforeEach(() => {
  server = ServerImpl.getInstance();
  // const mockApiCall = jest.spyOn(server, "loadChart");
  // mockApiCall.
});
test("loads without crashing", async () => {
  render(<App server={server} chartid={null} />);
});
