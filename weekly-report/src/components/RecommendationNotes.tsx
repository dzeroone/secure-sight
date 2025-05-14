import { RecommendationNote } from "../features/weekly/weeklySlice";

interface RecommendationNotesProps {
  notes: RecommendationNote[];
}

export default function RecommendationNotes({
  notes,
}: RecommendationNotesProps) {
  return (
    <div>
      {notes?.map((note, i) => (
        <div key={i}>
          <p className="font-bold capitalize">{note.key}</p>
          <ul className="list-inside text-justify">
            {note.data.map((j, k) => (
              <li className="text-sm" key={k}>
                {j}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
