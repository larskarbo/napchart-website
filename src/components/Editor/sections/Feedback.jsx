import React, { Component, useState } from "react";
import { ServerImpl } from "../../../server/server_impl";
const Feedback = () => {
  const [sent, setSent] = useState(false);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const sendFeedback = (tab) => {
    ServerImpl.getInstance().sendFeedback(value, (idFromServer) => {
      console.log("idFromServer: ", idFromServer);
      console.log("feedback sent");
      setSent(true);
      setId(idFromServer);
    });
  };

  const sendEmail = (tab) => {
    console.log("id: ", id);

    ServerImpl.getInstance().addEmailToFeedback(email, id, () => {
      console.log("feedback sent");
      setEmailSent(true);
    });
  };
  return (
    <>
      <div className="part">
        <h2 className="title is-6">Feedback</h2>
        {sent ? (
          <div className="field">
            {emailSent ? (
              <p>Thank you🤩</p>
            ) : (
              <>
                <p>
                  Thank you for your feedback, would you like to be notified by
                  email for updates?
                </p>
                <input
                  type="text"
                  value={email}
                  onChange={(a) => setEmail(a.target.value)}
                />
                <button onClick={sendEmail} className="button block">
                  Send
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="field">
              Issues, ideas, or other feedback appreciated 😏
            </p>
            <textarea
              className="textarea field"
              onChange={(a) => setValue(a.target.value)}
            ></textarea>
            <button onClick={sendFeedback} className="button block">
              Send
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Feedback;
