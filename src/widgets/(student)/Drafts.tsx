"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@lib/firebase";

export default function Drafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const q = query(
          collection(db, "drafts"),
          where("email", "==", currentUser.email)
        );
        const snapshot = await getDocs(q);
        const draftData = snapshot.docs.map((doc) => {
          console.log("doc.id:", doc.id);
          console.log("doc.data():", doc.data());
          return {
            docId: doc.id,
            ...doc.data(),
          };
        });
console.log(draftData)
        setDrafts(draftData);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const deleteDraft = async (draftId: string) => {
    try {
      await deleteDoc(doc(db, "drafts", draftId));
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      console.log("Draft deleted:", draftId);
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  };

  const handleEdit = (draftId: string) => {
    console.log("draftIf", draftId);
    router.push(`/dashboard/application/edit/${draftId}`); // Ensure this route exists
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading drafts...
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Your Drafts</h1>
      {drafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft,index) => (
            <div
              key={draft.id+index}
              className="p-4 border rounded-md bg-white shadow-sm flex flex-col justify-between"
            >
              <div className="mb-2">
                <p className="text-center font-semibold text-lg mb-3">
                  {" "}
                  {draft.title}
                </p>
                <p>
                  <strong>Name:</strong> {draft.firstName} {draft.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {draft.email}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(draft.docId)}
                  className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDraft(draft.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
