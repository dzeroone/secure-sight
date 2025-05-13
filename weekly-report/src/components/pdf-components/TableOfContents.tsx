import { useSelector } from "react-redux";
import BgFlipped from "../../assets/images/bg-flipped.png";
import { RootState } from "../../store/store";
import { TableIndexInfo } from "../../features/weekly/weeklySlice";

const TableOfContents = () => {
  const data = useSelector((state: RootState) => state.tableOfContents);

  return (
    <div
      className="table-of-content"
      style={{ backgroundImage: `url(${BgFlipped})` }}
    >
      <div className="page-header">
        <p className="text-white text-2xl font-semibold">TABLE OF CONTENTS</p>
      </div>

      <div className="px-12">
        <table className="mt-10 w-full mx-auto">
          <tbody>
            {data.map((item: TableIndexInfo, i: number) => (
              <tr key={i}>
                <td className="p-2 text-lg">
                  <a href={`#`}>{item.title}</a>
                  {/* {item.title} */}
                </td>
                <td className="p-2 text-right text-lg">{item.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {data?.date.blank !== 0 && (
        <div
          className="blank-page"
          style={{ height: `${1123 * data.blank}px` }}
        ></div>
      )} */}
    </div>
  );
};

export default TableOfContents;
