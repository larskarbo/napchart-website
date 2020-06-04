import React from "react";
import { render, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
import axiosMock from "axios";
import App from "../Editor";
import { Server } from "../../../server/server";
import { ServerImpl } from "../../../server/server_impl";
import "jest-canvas-mock";
import Napchart from "napchart";

var server: Server;
jest.mock("napchart");
beforeEach(() => {
  server = ServerImpl.getInstance();
  const initMock = jest.spyOn(Napchart, "init");
  initMock.mockReturnValue({
    data: {
      elements: [
        {
          start: 1260,
          end: 0,
          id: 2973,
          lane: 0,
          text: "",
          color: "red",
          duration: 210,
        },
        {
          start: 120,
          end: 300,
          id: 9817,
          lane: 0,
          text: "",
          color: "red",
          duration: 210,
        },
        {
          start: 1200,
          end: 300,
          id: 2957,
          lane: 1,
          text: "",
          color: "pink",
        },
      ],
      colorTags: [],
      shape: "circle",
      lanes: 2,
      lanesConfig: {
        "0": {
          locked: true,
        },
        "1": {
          locked: false,
        },
      },
    },
    history: {
      back: jest.fn(),
      canIGoBack: jest.fn(),
      forward: jest.fn(),
      canIGoForward: jest.fn(),
    },
    changeShape: {
      bind: () => jest.fn(),
    },
    selectedElement: null,
    forceFocusSelected: null,
    isTouchUser: true,
    getLaneConfig: (index) => ({
      locked: true,
    }),
    helpers: {
      duration: (start, end) => 0,
      minutesToReadable: (minutes) => "data",
    },
    toggleLockLane: jest.fn(),
    deleteLane: jest.fn(),
    config: {
      defaultColor: "green",
    },
    addLane: jest.fn(),
  });
});

test("loads without crashing", async () => {
  render(<App server={server} chartid={null} />);
});
