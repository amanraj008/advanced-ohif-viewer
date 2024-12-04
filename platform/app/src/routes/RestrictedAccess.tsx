import React, { FunctionComponent } from 'react';

interface OwnProps {}

type Props = OwnProps;

const RestrictedAccess: FunctionComponent<Props> = props => {
  return (
    <div className="flex h-full w-full content-center items-center justify-center bg-[#45197F] align-middle">
      <div className="mx-auto flex w-[40rem] flex-col items-center rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-700">Access Restricted !</h1>
        <p className="mb-6 text-gray-600">
          Access to this url is restricted. If you are looking for our diagnostics or radiologist
          application please go to our main URLs for access.
        </p>

        <div className="flex flex-row items-center justify-center gap-x-4">
          <a
            href="https://diagnostics.smaro.app"
            className="inline-block rounded-md bg-blue-500 py-2 px-4 font-semibold text-white transition duration-200 hover:bg-blue-600"
          >
            Diagnostics Login
          </a>
          <a
            href="https://radiologists.smaro.app"
            className="inline-block rounded-md bg-green-500 py-2 px-4 font-semibold text-white transition duration-200 hover:bg-green-600"
          >
            Radiologist Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;
