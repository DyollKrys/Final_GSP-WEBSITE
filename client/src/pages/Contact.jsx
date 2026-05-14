import PublicLayout from "../layouts/PublicLayout";

export default function Contact() {
  return (
    <PublicLayout>

      <div className="max-w-5xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-10">
          Contact Us
        </h1>

        <div className="bg-white p-10 rounded-3xl shadow-lg">

          <div className="space-y-5 text-lg">

            <p>
              Email:
              gsp_inlaoag@yahoo.com
            </p>

            <p>
              Address:
              Barangay 23 P. Paterno Street,
              Laoag City, Philippines
            </p>

          </div>

        </div>

      </div>

    </PublicLayout>
  );
}