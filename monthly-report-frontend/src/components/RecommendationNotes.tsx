import { RecommendationNote } from "@@/types/types";
import { useMemo } from "react";

interface RecommendationNotesProps {
  notes: RecommendationNote[];
}

export default function RecommendationNotes({
  notes,
}: RecommendationNotesProps) {
  const NoteList = useMemo(() => {
    return notes.map((note, i) => (
      <div key={i}>
        <p
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          {note.key}
        </p>
        <ul>
          {note.data.map((j, k) => (
            <li style={{ fontSize: 24 }} key={k}>
              {j}
            </li>
          ))}
        </ul>
      </div>
    ));
  }, [notes]);

  return <div>{NoteList}</div>;
}
