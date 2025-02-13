import { useAppSelector } from "@@/lib/hooks";

const TableOfContents = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.table_of_contents.data
  );

  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#000",
        }}
      >
        Table of Contents
      </p>
      <div style={{ padding: 0, margin: 0, marginTop: 40 }}>
        {data.map((item, i) => (
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            key={i}
          >
            <p
              style={{
                textDecoration: "none",
                color: "#000",
                fontSize: "1.6rem",
              }}
            >
              {i + 1}. <a href={`#${item.link}`}>{item.title}</a>
            </p>
            <p
              style={{
                textDecoration: "none",
                color: "#000",
                fontSize: "1.6rem",
                background: "#ededed",
                width: 60,
                height: 60,
                display: "grid",
                placeItems: "center",
                margin: 0,
              }}
            >
              {item.page_no}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;
