import PublicLayout from "../layouts/PublicLayout";
import { Link } from "react-router-dom";

export default function Forms() {
  return (
    <PublicLayout>

      <div className="max-w-6xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-12">
          Forms
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-white p-10 rounded-3xl shadow-lg">

            <h2 className="text-2xl font-bold text-green-900 mb-5">
              Troop Registration
            </h2>

            <p className="text-gray-600 mb-6">
              Register your troop online.
            </p>

            <Link
              to="/troop-registration"
              className="bg-green-900 text-white px-6 py-3 rounded-xl"
            >
              Open Form
            </Link>

          </div>

        </div>

      </div>

    </PublicLayout>
  );
}