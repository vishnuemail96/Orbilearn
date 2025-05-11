import React from "react";

const Card = ({ data, onClick }) => {
  return (
    <div
      className="relative flex w-80 h-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Card Image Area */}
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-border text-white shadow-lg shadow-blue-500/40">
        {data.image ? (
          <img
            src={`https://res.cloudinary.com/ddvpkg9d4/${data.image}`}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span>{data.title}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div>
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {data.title}
          </h5>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 ">
          {data.duration && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {data.duration}
            </span>
          )}
        </div>

        {data.average_package && (
          <div className="block font-sans text-base font-light leading-relaxed text-inherit antialiased mb-4">
            <p className="font-medium text-blue-700">
              {data.average_package.package}
            </p>
            <p>{data.average_package.salary_hike}</p>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="p-6 pt-0">
        {data.nearest_batch_date ? (
          <div className="flex justify-between items-center">
            <span className="text-orange-600 font-medium animate-pulse">
              {data.nearest_batch_date}
            </span>
            <button
              className="select-none rounded-lg bg-blue-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              View Details
            </button>
          </div>
        ) : (
          <button
            data-ripple-light="true"
            type="button"
            className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Read More
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
