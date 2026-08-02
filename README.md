API Notes & Known Limitations

Task Search:
The API documentation specifies title_like for searching tasks by title. The frontend sends the documented query parameter, for example:
GET /tasks?_page=1&_per_page=10&_sort=-id&title_like=Setup
However, during testing, the provided API returned an empty result even when a matching task existed (for example, Setup API Routes). Since this behavior originates from the provided API, the frontend keeps the implementation aligned with the documented API contract rather than introducing client-side search that could interfere with server-side pagination.

Assignee Filter:
During implementation of the assignee filter, I noticed a limitation in the provided API.
Tasks contain a members array, and the first member (members[0]) is used as the task assignee in the UI. The expected behavior is therefore to return tasks where the selected user matches members[0].
The provided API documentation supports json-server filtering and server-side pagination (_page / _per_page), but it does not document a way to filter specifically by an array index such as members[0].
For this reason, the implementation applies the assignee filter to the data returned for the current page. This keeps the implementation within the provided API constraints and avoids fetching the entire task collection on every request. A server-side members[0] filter would be required for fully accurate pagination across the filtered dataset.