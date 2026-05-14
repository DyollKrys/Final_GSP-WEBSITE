import PublicLayout from "../layouts/PublicLayout";
import gspLogo from "../components/gsp_logo.jpg";

export default function About() {
  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <div className="bg-green-900 text-white pt-20 pb-32 relative">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-6xl font-bold italic text-center mb-10">
            About Us
          </h1>
        </div>
      </div>

      {/* FLOATING LOGO BADGE */}
      <div className="flex justify-center -mt-20 relative z-10 mb-20">
        <div className="bg-white rounded-full p-3 shadow-2xl">
          <img
            src={gspLogo}
            alt="GSP Logo"
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-5 py-20">
        <section className="text-center mb-20">
          <h2 className="text-4xl italic font-bold text-green-900 mb-8">
            About the Council
          </h2>
          <p className="text-lg text-gray-600 leading-8">
            The Girl Scouts of the Philippines – Ilocos Norte-Laoag Council is
            committed to empowering girls and young women through leadership,
            service, and community engagement.
          </p>
        </section>

        {/* COUNCIL BOARD SECTION */}
        <section className="bg-white border-2 border-green-900 rounded-3xl p-12 mb-20">
          <h2 className="text-4xl italic font-bold text-green-900 mb-8 text-center">
            Council Board (Triennium 2024–2027)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { role: "President", name: "ATTY. CORAZON J. RUIZ-ABAD" },
              { role: "VP for Field", name: "DR. BETTY A. SALVADOR" },
              { role: "VP for Fund Development", name: "MRS. VIRALUZ S. RAGUINDIN" },
              { role: "VP for International Partnership", name: "DR. LIGAYA SOLEDAD T. MIGUEL" },
              { role: "Secretary", name: "MRS. CHRISTY ANN M. RAHON" },
              { role: "Assistant Secretary", name: "MISS VICTORIA M. LADIA" },
              { role: "Treasurer", name: "MRS. VIRALUZ S. RAGUINDIN" },
              { role: "Assistant Treasurer", name: "MRS. TERESITA R. DIMAGIBA" },
              { role: "Auditor", name: "MRS. LIGAYA F. RAGUDO" },
            ].map((member, idx) => (
              <div key={idx} className="pb-4">
                <p className="text-xs font-bold text-green-900 uppercase tracking-widest mb-1">
                  {member.role}
                </p>
                <p className="text-gray-800">{member.name}</p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold border-l-4 border-green-900 pl-4 mb-4 text-gray-800">
              Commissioners on Administration
            </h3>
            <ul className="ml-4">
              {["SUPT. DONATO D. BALDERAS, JR.", "SUPT. JOANN A. CORPUZ", "SUPT. ANSELMO R. ALUDINO"].map((name, idx) => (
                <li key={idx} className="text-gray-700"><span className="text-green-900 font-bold">•</span> {name}</li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold border-l-4 border-green-900 pl-4 mb-4 text-gray-800">Life Members</h3>
            <ul className="ml-4">
              {["ATTY. CORAZON J. RUIZ-ABAD", "ATTY. MA. CONSUELO F. CORPUZ", "DR. ANUNCIACION D. PAGDILAO", "ATTY. AMEURFINA A. RESPICIO"].map((name, idx) => (
                <li key={idx} className="text-gray-700"><span className="text-green-900 font-bold">•</span> {name}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* SPECIAL BOARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white border-2 border-green-900 rounded-3xl p-10">
            <h2 className="text-3xl italic font-bold text-green-900 mb-2 text-center">
              Senior & Cadet Planning Board
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 italic">Re-organized March 15, 2025</p>
            <div className="space-y-3 mb-6">
              {[
                { label: "Chairman", value: "Cadet Sct. Hera Krishna M. Rahon" },
                { label: "Vice-Chairman", value: "Cadet Sct. Aislyn Keith A. Bartolome" },
                { label: "Secretary", value: "Senior Sct. Ymea Yzabelle Agcaoili" },
                { label: "Assistant Secretary", value: "Senior Sct. Ashley Paguirigan" },
                { label: "Treasurer", value: "Senior Sct. Kristine Agustin" },
                { label: "Assistant Treasurer", value: "Cadet Sct. Precious Ann Balderas" },
              ].map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  <span className="font-bold text-green-900">{item.label}:</span> {item.value}
                </p>
              ))}
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">P.I.O.</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "Central Zone – Cadet Sct. Majell Pasalo",
                  "North Zone – Senior Sct. Mary Louise Talimungan",
                  "South Zone – Senior Sct. Hazel Lumang",
                  "East Zone – Senior Sct. Paulene Arellano",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-900">Business Manager:</span> Senior Sct. Abbey Libratan
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-900">Auditor:</span> Rizzamae Antoniette Bayangos
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Members</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "North Zone – Senior Sct. Jherel Dapnie Jesual",
                  "Central Zone – Cadet Sct. Arabella Lauren Damo",
                  "South Zone – Senior Sct. Fabien Chloe Yahin",
                  "East Zone – Senior Sct. Cristy Tugadi",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Advisers</h4>
              <ul className="ml-4 space-y-2">
                {["Ms. Emiliaflor A. Lived", "Ms. Nueralyn A. Ceria"].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-white border-2 border-green-900 rounded-3xl p-10">
            <h2 className="text-3xl italic font-bold text-green-900 mb-2 text-center">
              Council S.A.V.E.R. Team
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 italic">Re-organized March 15, 2025</p>
            <div className="space-y-3 mb-6">
              {[
                { label: "Chairman", value: "Senior Sct. Maria Sophia Nazarino" },
                { label: "Vice-Chairman", value: "Senior Sct. Jilian Mae Concepcion" },
                { label: "Secretary", value: "Cadet Sct. Rylie Felicity Algonanota" },
                { label: "Asst. Secretary", value: "Cadet Sct. Zairah Yaneza Gabrielle Ranay" },
                { label: "Treasurer", value: "Cadet Sct. Charmel Lynette Gabrielle" },
                { label: "Asst. Treasurer", value: "Senior Sct. Kayel Najah Renice Campos" },
                { label: "Auditor", value: "Senior Sct. Diana S. Rañada" },
                { label: "Business Manager", value: "Senior Sct. Chrissa Galindo" },
                { label: "P.I.O.", value: "Senior Sct. Ann Zyna Calaramo" },
              ].map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  <span className="font-bold text-green-900">{item.label}:</span> {item.value}
                </p>
              ))}
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">Members</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "Senior Sct. Kiersien Cielo Bacud",
                  "Ms. Mariza Felipe-Corpuz, RN",
                  "Dr. MyGem F. Corpuz",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-900">Non-Girl Scout Member:</span> Ms. Kaye Stephanie S. Cabasaan, RN
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Advisers</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "Ms. Josephine Gloria S. Tudlong",
                  "Ms. Michelle Joy S. Quemquem",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-white border-2 border-green-900 rounded-3xl p-10">
            <h2 className="text-3xl italic font-bold text-green-900 mb-2 text-center">
              Junior Journalists Guild
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 italic">Re-organized March 15, 2025</p>
            <div className="space-y-3">
              {[
                { label: "Editor-in-Chief", value: "Senior Sct. Precious Ariene Vertido" },
                { label: "Associate Editor", value: "Senior Sct. Jorgina Alliah Corpuz" },
                { label: "Managing Editor", value: "Senior Sct. Trisha Kate Tubera" },
                { label: "News Editor", value: "Senior Sct. Khaizen Kate Agaran" },
                { label: "Features Editor", value: "Cadet Sct. Angel Rose Vicente" },
                { label: "Literary Editor", value: "Cadet Sct. Lie Ann Pearl Raymundo" },
                { label: "Photojournalist", value: "Senior Sct. Jhaira Laurice Edrada" },
                { label: "Layout Artist", value: "Cadet Sct. Jeriana Nicole Buguis" },
                { label: "Contributors", value: "Cadet Sct. Trexsie Mae James" },
              ].map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  <span className="font-bold text-green-900">{item.label}:</span> {item.value}
                </p>
              ))}
              <h4 className="text-lg font-bold text-gray-800 mt-6 mb-3">Advisers</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "Ms. Christy Ann Mina-Rahon",
                  "Ms. Mirasol D. Rosete",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-white border-2 border-green-900 rounded-3xl p-10">
            <h2 className="text-3xl italic font-bold text-green-900 mb-2 text-center">
              Radio / TV Club
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 italic">Re-organized March 15, 2025</p>
            <div className="space-y-3 mb-6">
              {[
                { label: "Chairman", value: "Cadet Sct. Celine Alexa N. Saet" },
                { label: "Vice-Chairman", value: "Senior Sct. Erica Khyme G. De Guzman" },
                { label: "Secretary", value: "Senior Sct. Kiara Jianee Danelle Maligsay" },
                { label: "Treasurer", value: "Senior Sct. Frances Lynne Aganon" },
                { label: "Auditor", value: "Senior Sct. Zen Irish Pasamonte" },
                { label: "Business Manager", value: "Senior Sct. Mariela Jara Ambalan" },
                { label: "P.I.O.", value: "Cadet Sct. Tiffany Joy Aguilar" },
              ].map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  <span className="font-bold text-green-900">{item.label}:</span> {item.value}
                </p>
              ))}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3">Advisers</h4>
              <ul className="ml-4 space-y-2">
                {[
                  "Ms. Frances Lowie C. Vicente",
                  "Ms. Criza Maeridel C. Ubasa",
                ].map((name, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="text-green-900 font-bold">•</span> {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}