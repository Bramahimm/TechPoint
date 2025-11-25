import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminPageWrapper;