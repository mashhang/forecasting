export default function AdministrationPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User & Role Management</h2>
          <button className="rounded-xl bg-[var(--brand-gold)] px-3 py-2">
            Add User
          </button>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-3 py-2">Ana Santos</td>
                <td className="px-3 py-2">asantos@loa.edu.ph</td>
                <td className="px-3 py-2">Accounting</td>
                <td className="px-3 py-2">Finance</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Active
                  </span>
                </td>
                <td className="space-x-2 px-3 py-2">
                  <button className="rounded-lg border px-2 py-1 text-xs">
                    Edit
                  </button>
                  <button className="rounded-lg border px-2 py-1 text-xs">
                    Disable
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">Mark Dela Cruz</td>
                <td className="px-3 py-2">mdc@loa.edu.ph</td>
                <td className="px-3 py-2">Dept Head</td>
                <td className="px-3 py-2">Engineering</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                    Pending
                  </span>
                </td>
                <td className="space-x-2 px-3 py-2">
                  <button className="rounded-lg border px-2 py-1 text-xs">
                    Approve
                  </button>
                  <button className="rounded-lg border px-2 py-1 text-xs">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
