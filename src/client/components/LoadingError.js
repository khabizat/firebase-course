import React from 'react';
import Card from './Card';

const options = {
  loading: {
    h3: 'Just a sec',
    p: 'Loading data from Firebase...',
  },
  error: {
    h3: '⚠️Oops',
    p: "Can't fetch the data. Open the console to see details",
  },
};

const LoadingError = ({ data, loading, error, children }) => {
  if (error) console.error(error);

  return (
    <>
      {loading && (
        <Card>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {options.loading.h3}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            {options.loading.p}
          </p>
        </Card>
      )}

      {(error || (!loading && !data)) && (
        <Card>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {options.error.h3}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            {options.error.p}
          </p>
        </Card>
      )}

      {data && children}
    </>
  );
};

export default LoadingError;
