import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import healthUpdateStrategyListFixtures from "../../fixtures/healthUpdateStrategyListFixtures";
import commonsFixtures from "fixtures/commonsFixtures";

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockedNavigate(x); return null; }
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminCreateCommonsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        axiosMock.onGet("/api/commons/defaults").reply(200, commonsFixtures.defaultCommonValues[0]);
        axiosMock.onGet("/api/commons/all-health-update-strategies")
            .reply(200, healthUpdateStrategyListFixtures.simple);
    });

    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateCommonsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText("Create Commons")).toBeInTheDocument();
    });

    test("When you fill in form and click submit, the right things happens", async () => {
        axiosMock.onPost("/api/commons/new").reply(200, {
            "id": 5,
            "name": "My New Commons",
            "cowPrice": 10,
            "milkPrice": 5,
            "startingBalance": 500,
            "startingDate": "2022-03-05T00:00:00",
            "lastDay": "2022-06-05T00:00:00",
            "degradationRate": 30.4,
            "capacityPerUser": 10,
            "carryingCapacity": 25,
            "showLeaderboard": false,
            "aboveCapacityHealthUpdateStrategy": "strat2",
            "belowCapacityHealthUpdateStrategy": "strat3"
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateCommonsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Create Commons")).toBeInTheDocument();

        const commonsNameField = screen.getByLabelText("Commons Name");
        const startingBalanceField = screen.getByLabelText("Starting Balance");
        const cowPriceField = screen.getByLabelText("Cow Price");
        const milkPriceField = screen.getByLabelText("Milk Price");
        const startDateField = screen.getByLabelText("Starting Date");
        const lastDayField = screen.getByLabelText("Last Day");
        const degradationRateField = screen.getByLabelText("Degradation Rate");
        const capacityPerUserField = screen.getByLabelText("Capacity Per User");
        const carryingCapacityField = screen.getByLabelText("Carrying Capacity");
        const aboveCapacityHealthUpdateStrategyField = screen.getByLabelText("When above capacity");
        const belowCapacityHealthUpdateStrategyField = screen.getByLabelText("When below capacity");
        const showLeaderboardField = screen.getByLabelText("Show Leaderboard?");
        const button = screen.getByTestId("CommonsForm-Submit-Button");

        fireEvent.change(commonsNameField, { target: { value: 'My New Commons' } })
        fireEvent.change(startingBalanceField, { target: { value: '500' } })
        fireEvent.change(cowPriceField, { target: { value: '10' } })
        fireEvent.change(milkPriceField, { target: { value: '5' } })
        fireEvent.change(startDateField, { target: { value: '2022-03-05' } })
        fireEvent.change(lastDayField, { target: { value: '2022-06-05' } })
        fireEvent.change(degradationRateField, { target: { value: '30.4' } })
        fireEvent.change(capacityPerUserField, { target: { value: '10' } })
        fireEvent.change(carryingCapacityField, { target: { value: '25' } })
        fireEvent.change(showLeaderboardField, { target: { value: false } })

        fireEvent.change(aboveCapacityHealthUpdateStrategyField, { target: {value: 'strat2' } })
        fireEvent.change(belowCapacityHealthUpdateStrategyField, { target: {value: 'strat3' } })
        fireEvent.click(button);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        // The Date object is initialized from the form without time information. I believe React
        // Query calls toISOString() before stuffing it into the body of the POST request, so the
        // POST contains the suffix .000Z, which Java's LocalDateTime.parse ignores. [1]

        const expectedCommons = {
            name: "My New Commons",
            startingBalance: 500,
            cowPrice: 10,
            milkPrice: 5,
            degradationRate: 30.4,
            capacityPerUser: 10,
            carryingCapacity: 25,
            belowCapacityHealthUpdateStrategy: "strat3",
            aboveCapacityHealthUpdateStrategy: "strat2",
            startingDate: '2022-03-05T00:00:00.000Z',
            lastDay: '2022-06-05T00:00:00.000Z',
            showLeaderboard: false,
        };

        expect(axiosMock.history.post[0].data).toEqual( JSON.stringify(expectedCommons) );

        expect(mockToast).toBeCalledWith(<div>Commons successfully created!
            <br />id: 5
            <br />name: My New Commons
            <br />startingBalance: 500
            <br />cowPrice: 10
            <br />milkPrice: 5
            <br />degradationRate: 30.4
            <br />carryingCapacity: 25
            <br />capacityPerUser: 10
            <br />startDate: 2022-03-05T00:00:00
            <br />aboveCapacityHealthUpdateStrategy: strat2
            <br />belowCapacityHealthUpdateStrategy: strat3
            <br />showLeaderboard: false
        </div>);
        
        expect(mockedNavigate).toBeCalledWith({"to": "/"});
    });
});
