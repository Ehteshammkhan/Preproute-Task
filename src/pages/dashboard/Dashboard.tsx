import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button, Card, Loader } from "../../components/ui";
import { getTests } from "../../api/tests.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { formatDate, getApiError, errorToast } from "../../utils";

const PAGE_SIZE = 8;

function Dashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: tests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.TESTS,
    queryFn: getTests,
  });

  const filteredTests = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return tests;

    return tests.filter((test) => {
      return (
        test.name?.toLowerCase().includes(keyword) ||
        test.subject?.toLowerCase().includes(keyword) ||
        test.status?.toLowerCase().includes(keyword) ||
        test.type?.toLowerCase().includes(keyword) ||
        test.difficulty?.toLowerCase().includes(keyword)
      );
    });
  }, [tests, search]);

  const totalPages = Math.ceil(filteredTests.length / PAGE_SIZE);

  const paginatedTests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTests.slice(start, start + PAGE_SIZE);
  }, [filteredTests, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Test Creation</h2>
          <p className="text-sm text-gray-500">Manage all created tests</p>
        </div>

        <Button
          className="w-auto px-5"
          onClick={() => navigate("/tests/create")}
        >
          Create New Test
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-red-500">
            {getApiError(error)}
          </div>
        ) : tests.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No tests found</div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by test name, subject, status..."
                className="h-11 w-full max-w-md rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
              />

              <p className="text-sm text-gray-500">
                Showing {filteredTests.length} of {tests.length} tests
              </p>
            </div>

            {filteredTests.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No matching tests found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="py-3">Name</th>
                        <th className="py-3">Subject</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Created</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedTests.map((test) => (
                        <tr key={test.id} className="border-b last:border-b-0">
                          <td className="py-4 font-medium">{test.name}</td>

                          <td className="py-4">{test.subject || "-"}</td>

                          <td className="py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs capitalize text-blue-600">
                              {test.status || "draft"}
                            </span>
                          </td>

                          <td className="py-4">
                            {test.created_at
                              ? formatDate(test.created_at)
                              : "-"}
                          </td>

                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                className="text-blue-600 hover:underline"
                                onClick={() =>
                                  navigate(`/tests/${test.id}/preview`)
                                }
                              >
                                View
                              </button>

                              <button
                                type="button"
                                className="text-green-600 hover:underline"
                                onClick={() =>
                                  navigate(`/tests/${test.id}/edit`)
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="text-red-600 hover:underline"
                                onClick={() =>
                                  errorToast(
                                    "Delete feature is not available in API docs",
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="rounded border px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="rounded border px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
