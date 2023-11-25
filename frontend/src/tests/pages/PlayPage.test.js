import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import PlayPage from "main/pages/PlayPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PlayPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        const userCommons = {
            commonsId: 1,
            id: 1,
            totalWealth: 0,
            userId: 1
        };
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, userCommons);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
        axiosMock.onGet("/api/commons/plus", { params: { id: 1 } }).reply(200, {
            commons: {
                id: 1,
                name: "Sample Commons"
            },
            totalPlayers: 5,
            totalCows: 5 
        });
        axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommons);
    });

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("click buy and sell buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-cow-button")).toBeInTheDocument();
        const buyCowButton = screen.getByTestId("buy-cow-button");
        fireEvent.click(buyCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

        const sellCowButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(2));

    });

    test("Make sure that both the Announcements and Welcome Farmer components show up", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByTestId("CommonsPlay")).toBeInTheDocument();
    });

    test("Make sure div has correct attributes", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        var div = screen.getByTestId("playpage-div");
        expect(div).toHaveAttribute("style", expect.stringContaining("background-size: cover; background-image: url(PlayPageBackground.png);"));
    });

    test("Chat toggle button opens and closes the ChatPanel", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("chat-feature-container")).toBeInTheDocument();
        });
    
        // Make sure the chat toggle button is visible
        const chatToggleButton = screen.getByTestId("chat-toggle");
        expect(chatToggleButton).toBeInTheDocument();
        
        // Make sure the ChatPanel is not visible initially
        expect(screen.queryByTestId("ChatPanel")).not.toBeInTheDocument();
    
        // Click the chat toggle button to open the ChatPanel
        fireEvent.click(chatToggleButton);
    
        // Wait for the ChatPanel to become visible
        await waitFor(() => {
            expect(screen.getByTestId("ChatPanel")).toBeInTheDocument();
        });
    
        // Click the chat toggle button again to close the ChatPanel
        fireEvent.click(chatToggleButton);
    
        // Wait for the ChatPanel to become hidden
        await waitFor(() => {
            expect(screen.queryByTestId("ChatPanel")).not.toBeInTheDocument();
        });
    });

    test("Chat button and container have correct styles", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("chat-feature-container")).toBeInTheDocument();
        });

        const chatContainer = screen.getByTestId("playpage-chat-div");
        const chatButton = screen.getByTestId("chat-toggle");
        const chatClosedIcon = screen.getByTestId("chat-closed-icon");
        const chatBubbleIcon = screen.getByTestId("chat-bubble-icon");
        var chatOpenedIcon = null;

        expect(chatButton).toContainElement(chatClosedIcon);

        // Click the chat toggle button to open the ChatPanel
        fireEvent.click(chatButton);

        await waitFor(() => {
            chatOpenedIcon = screen.getByTestId("chat-opened-icon");
            expect(chatButton).toContainElement(chatOpenedIcon);
        });

        // Check styles for the chat icons
        expect(chatClosedIcon).toHaveStyle(`
            width: 95px;
            position: fixed;
            bottom: 10px;
            right: 30px;
        `);

        expect(chatOpenedIcon).toHaveStyle(`
            width: 95px;
            position: fixed;
            bottom: 10px;
            right: 30px;
        `);

        // Check styles for the chat bubble icon
        expect(chatBubbleIcon).toHaveStyle(`
            width: 67px;
            position: fixed;
            bottom: 80px;
            right: 120px;
        `);

        // Check styles for the chat container
        expect(chatContainer).toHaveStyle(`
            width: 550px;
            position: fixed;
            bottom: 130px;
            right: 10px;
        `);
    });
    
});