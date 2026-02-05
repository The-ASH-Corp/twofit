import { useDispatch } from "react-redux";
 
export default function HabitRow({ habit, clientId }) {
  const dispatch = useDispatch();

//   const handleUpdate = (status) => {
//     dispatch(
//       updateHabitStatusThunk({
//         clientId,
//         habitName: habit.name,
//         status,
//       })
//     );
//   };

  return (
    <tr className="border-t border-gray-200">
      <td className="p-2 capitalize text-sm font-medium">
        {habit.name.replaceAll("_", " ")}
      </td>

      <td className="p-2 text-center space-x-3">
        <button
          onClick={() => handleUpdate("done")}
          className="text-green-600 text-xl"
        >
          ✔
        </button>

        <button
          onClick={() => handleUpdate("missed")}
          className="text-red-500 text-xl"
        >
          ✖
        </button>
      </td>
    </tr>
  );
}
