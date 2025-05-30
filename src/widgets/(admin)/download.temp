"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Download() {
  const params = useParams();
  const appId = params?.appId as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appId) return;

    const fetchApplication = async () => {
      try {
        const docRef = doc(db, "admission_application", appId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApplication({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such application!");
        }
      } catch (err) {
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [appId]);

  const handleDownloadPDF = async () => {
    const input = previewRef.current;
    if (!input) return;

    // Set a fixed width that matches A4 paper aspect ratio
    const originalWidth = input.offsetWidth;
    const originalHeight = input.offsetHeight;
    const a4Ratio = 210 / 297; // A4 width/height in mm
    
    // Temporarily adjust the element size for PDF generation
    input.style.width = `${originalWidth}px`;
    input.style.height = "auto";

    const canvas = await html2canvas(input, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      // letterRendering: true,
    });

    // Reset the element size
    input.style.width = "";
    input.style.height = "";

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate aspect ratio of the image
    const imgAspectRatio = imgWidth / imgHeight;
    let pdfWidth = pageWidth - 20; // 10mm margin on each side
    let pdfHeight = pdfWidth / imgAspectRatio;

    // If the content is taller than the page, adjust dimensions
    if (pdfHeight > pageHeight - 20) {
      pdfHeight = pageHeight - 20;
      pdfWidth = pdfHeight * imgAspectRatio;
    }

    // Center the content on the page
    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);
    pdf.save(`${application?.name || "application"}.pdf`);
  };

  if (loading) return <div>Loading...</div>;
  if (!application) return <div>No application data found</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={previewRef}
        id="application-preview"
        className="w-[210mm] min-h-[297mm] gap-1 flex flex-col mx-auto bg-white p-6 text-sm text-black"
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1.5,
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-1">Carmel Polytechnic College</h1>
          <p className="text-lg font-semibold mb-1">
            Application for Polytechnic Admission 2024-2025
          </p>
          <p className="mb-1">Management Merit - Regular</p>
          <p>Govt. Management Quota Application No. (www.polyadmission.org): 131752</p>
        </div>
        
        <div className="w-full h-px bg-black mb-4"></div>
        
        {/* Application Meta */}
        <div className="flex justify-between mb-6">
          <p>Application Number: CRML-02311-20240604</p>
          <p>Index Score: 6.7875004</p>
          <p>Fees to be remitted: Rs. 200/-</p>
        </div>

        {/* Branch Preference */}
        <div className="border border-black p-3 mb-6">
          <p className="font-semibold mb-2 underline">Branch Preference</p>
          <div className="grid grid-cols-3 gap-2">
            <p><strong>Preference 1:</strong> Electronics</p>
            <p><strong>Preference 2:</strong> NIL</p>
            <p><strong>Preference 3:</strong> NIL</p>
          </div>
        </div>

       <div className="border border-black p-2 mb-3">
  <p className="font-semibold mb-1 underline">Candidate Profile</p>
  <div className="grid grid-cols-2 gap-x-4 gap-y-0"> {/* gap-y-0 for tight spacing */}
    {/* Left Column */}
    <div className="space-y-0"> {/* No extra space between items */}
      <p className="leading-none"><strong>Name of the Applicant:</strong> SREESANTH S</p>
      <p className="leading-none"><strong>Date of Birth:</strong> 27/12/2005</p>
      <p className="leading-none"><strong>Religion:</strong> Hindu</p>
      <p className="leading-none"><strong>Email:</strong> ssreesanth025@gmail.com</p>
      <p className="leading-none"><strong>Aadhar Number:</strong> 937746347271</p>
    </div>
    
    {/* Right Column */}
    <div className="space-y-0">
      <p className="leading-none"><strong>Gender:</strong> Male</p>
      <p className="leading-none"><strong>Place of Birth:</strong> ALAPPUZHA</p>
      <p className="leading-none"><strong>Community:</strong> EZHAVA</p>
      <p className="leading-none"><strong>Phone Number:</strong> 8113053904</p>
    </div>
    
    {/* Full Width Address */}
    <div className="col-span-2 mt-1"> {/* Small top margin only */}
      <p className="leading-none"><strong>Address:</strong> Parampil, Mithrakkary, Mithrakkary P O, Alappuzha, PIN Code: 689595, Kerala, India</p>
    </div>
  </div>
</div>

        {/* Academic History */}
        <div className="border border-black p-3 mb-6">
          <p className="font-semibold mb-2 underline">Academic History</p>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black p-2 text-left">Course</th>
                <th className="border border-black p-2 text-left">Name of the Institution</th>
                <th className="border border-black p-2 text-left">University / Board</th>
                <th className="border border-black p-2 text-left">Passed on</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">SSLC</td>
                <td className="border border-black p-2">St. Xaviers HS Mithrakkary</td>
                <td className="border border-black p-2">Kerala State</td>
                <td className="border border-black p-2">Mar-2022</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Qualifying Examination */}
        <div className="border border-black p-3 mb-6">
          <div className="flex justify-between mb-2">
            <p className="font-semibold underline">Qualifying Examination: SSLC</p>
            <p className="font-semibold">Chances taken: 1</p>
          </div>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black p-2 text-left">No.</th>
                <th className="border border-black p-2 text-left">Subject</th>
                <th className="border border-black p-2 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              {[
                [1, "First Language – Paper I", "C"],
                [2, "First Language – Paper II", "A+"],
                [3, "English", "A"],
                [4, "Hindi", "A+"],
                [5, "Social Science", "C+"],
                [6, "Physics", "B+"],
                [7, "Chemistry", "B"],
                [8, "Biology", "B+"],
                [9, "Mathematics", "B"],
                [10, "Information Technology", "A+"],
              ].map(([no, subject, grade]) => (
                <tr key={no as number}>
                  <td className="border border-black p-2">{no as number}</td>
                  <td className="border border-black p-2">{subject as string}</td>
                  <td className="border border-black p-2">{grade as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guardian Info */}
        <div className="border border-black p-3">
          <p className="font-semibold mb-2 underline">Guardian Info</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p><strong>Name of the Guardian:</strong> SASI</p>
            <p><strong>Relationship with Applicant:</strong> Father</p>
            <p><strong>Occupation:</strong> Fisherman</p>
            <p><strong>Monthly Income:</strong> 1000</p>
            <p><strong>Phone Number:</strong> 8113053904</p>
            <div className="col-span-2">
              <p><strong>Address (Residence):</strong> Parampil, Mithrakkary, Mithrakkary P O, Alappuzha, PIN Code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}