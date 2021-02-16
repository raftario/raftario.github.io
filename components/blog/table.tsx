export const Table = (props) => (
  <div className="my-4 mx-2 overflow-x-auto">
    <table
      className="table-auto border-collapse border-2 border-base2"
      {...props}
    />
  </div>
);
export const TH = (props) => (
  <th className="border-2 border-base2 bg-base2 px-2 py-1" {...props} />
);
export const TD = (props) => (
  <td className="border-2 border-base2 px-2 py-1" {...props} />
);

export default { Table, TH, TD };
