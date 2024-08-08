import * as React from "react";

import { HttpResponse, http } from "msw";
import { SetupServerApi, setupServer } from "msw/node";
import { act, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Router } from "@remix-run/router";
import userEvent from "@testing-library/user-event";
import * as missingDataProps from "../../__mocks__/missingMBDataProps.json";
import {
  renderWithProviders,
  textContentMatcher,
} from "../../test-utils/rtl-test-utils";
import getSettingsRoutes from "../../../src/settings/routes";
import Layout from "../../../src/layout";

jest.unmock("react-toastify");

const user = userEvent.setup();
const routes = getSettingsRoutes();

describe("MissingMBDataPage", () => {
  let server: SetupServerApi;
  let router: Router;
  beforeAll(async () => {
    window.scrollTo = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    // Mock the server responses
    const handlers = [
      http.post("/settings/missing-data/", ({ request }) => {
        return HttpResponse.json({
          missing_data: missingDataProps.missingData,
        });
      }),
    ];
    server = setupServer(...handlers);
    server.listen();
    // Create the router *after* MSW mock server is set up
    // See https://github.com/mswjs/msw/issues/1653#issuecomment-1781867559
    router = createMemoryRouter(routes, {
      initialEntries: ["/settings/missing-data/"],
    });
  });

  afterAll(() => {
    server.close();
  });

  it("renders the missing musicbrainz data page correctly", async () => {
    renderWithProviders(
      <RouterProvider router={router} />,
      {
        currentUser: missingDataProps.user,
      },
      undefined,
      false
    );
    await screen.findByText(
      textContentMatcher("Missing MusicBrainz Data of riksucks")
    );
    const albumGroups = await screen.findAllByRole("heading", { level: 3 });
    // 25 groups per page
    // These albums should be grouped and sorted by size before being paginated and displayed
    expect(albumGroups).toHaveLength(25);
    expect(albumGroups.at(0)).toHaveTextContent("x 10 Paharda (Remixes)");
    expect(albumGroups.at(1)).toHaveTextContent(
      "Trip to California (Stoner Edition)"
    );
  });

  it("has working navigation", async () => {
    renderWithProviders(
      <RouterProvider router={router} />,
      {
        currentUser: missingDataProps.user,
      },
      undefined,
      false
    );
    await screen.findByText("Paharda (Remixes)", { exact: false });
    // Check that items from bigger groups get sorted and displayed
    // on the first page despite being at the bottom of the data array
    await screen.findByText("Trip to California (Stoner Edition)", {
      exact: false,
    });
    expect(
      screen.queryByText("Broadchurch (Music From The Original TV Series)")
    ).toBeNull();

    const nextButton = screen.getByText("Next →", { exact: false });
    await user.click(nextButton);
    expect(
      screen.queryByText(textContentMatcher("Paharda (Remixes)"), {
        exact: false,
      })
    ).toBeNull();
    await screen.findByText("Broadchurch (Music From The Original TV Series)");

    const prevButton = screen.getByText("Previous", { exact: false });
    await user.click(prevButton);
    await screen.findByText("Paharda (Remixes)", { exact: false });
    expect(
      screen.queryByText("Broadchurch (Music From The Original TV Series)")
    ).toBeNull();
  });

});
