import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full outline-none w-20";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full outline-none w-20";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();

  const { userId } = useParams();

  // Fetch user profile data base on userId
  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  // Fetch user created or saved pins
  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // Google logout
  const logoutFunction = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="flex relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          {/* Cover pic, user avatar and Google logout */}
          <div
            className="flex flex-col justify-center items-center relative"
            style={{ marginTop: activeBtn === 'created' ? "8.25rem" : "" }}
          >
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute z-1 bottom-28 right-5 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="flex gap-2 bg-white p-2 rounded-lg 
                      cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                      Logout
                    </button>
                  )}
                  onLogoutSuccess={logoutFunction}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>

          {/* Buttons to show Created or Saved pins */}
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {/* Display Created or Saved pins section */}
          {pins?.length > 0 ? (
            <div className="max-h-80 px-2 overflow-y-auto">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div
              className="flex justify-center font-bold 
              items-center w-full text-xl mt-2"
            >
              No Pins found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
