import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import LeaderboardTable from "main/components/Leaderboard/LeaderboardTable";
import leaderboardFixtures from "fixtures/leaderboardFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("LeaderboardTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]}/>
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={leaderboardFixtures.threeUserCommonsLB}/>
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ['Farmer', 'Total Wealth', 'Cows Owned', 'Cow Health', 'Cows Bought', 'Cows Sold', 'Cow Deaths'];
    const expectedFields = ['username', 'totalWealth','numOfCows', 'cowHealth', 'cowsBought', 'cowsSold', 'cowDeaths'];
    const testId = "LeaderboardTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-username`)).toHaveTextContent("one");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-totalWealth`)).toHaveTextContent("$1,000.00");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsBought`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsSold`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowDeaths`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-username`)).toHaveTextContent("two");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-totalWealth`)).toHaveTextContent("$1,000.00");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowsBought`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowsSold`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowDeaths`)).toHaveTextContent("5");

  });

  test("All columns are formatted correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={leaderboardFixtures.fiveUserCommonsLB} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expect(screen.getAllByText("$1,000.00")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("93")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("8")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("8")[1]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("8")[2]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("8")[3]).toHaveStyle("text-align: right;");





  });
    

});