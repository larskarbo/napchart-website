import React, { Component } from "react";
import { RadioButton } from "@bit/primefaces.primereact.radiobutton";
import {
  Grommet,
  Box,
  Text,
  Layer,
  RadioButtonGroup,
  TextInput,
  Button
} from "grommet";

import Parse from "parse";
import shuffle from "shuffle-array";
const setOptions = shuffle([
  "Email & password authentication",
  "Google authentication",
  "Facebook authentication"
]);

function Example() {
  const [value, setValue] = React.useState("one");
  return (
    <RadioButtonGroup
      name="doc"
      options={["one", "two"]}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  );
}

const PopupVoter = ({ onClose }) => {
  const [provider, setProvider] = React.useState(setOptions[0]);
  const [other, setOther] = React.useState("");
  return (
    <Layer onClickOutside={onClose}>
      <Box pad="large">
        <Text>
          Hi, <strong>sorry for disturbing</strong>, just a quick question
        </Text>
        <Box pad={{ vertical: "small" }}>
          <Text>
            I am going to implement <strong>user authentication</strong> on
            Napchart, which login <i>provider</i> would you prefer to use?
          </Text>
        </Box>
        <Box pad="small">
          {[...setOptions, "Other"].map(r => (
            <Box
              pad={{ vertical: "small" }}
              direction="row"
              onClick={() => {
                setProvider(r);
              }}
            >
              <RadioButton
                checked={provider == r}
                name={r}
                value={r}
                key={r}
                disabled={false}
                onChange={event => {
                  console.log("hest");
                  setProvider(r);
                }}
                style={{
                  marginRight: 10,
                  marginBottom: 5
                }}
              />
              <label htmlFor={r} className="p-radiobutton-label">
                {r}
              </label>
            </Box>
          ))}
          {provider == "Other" && (
            <TextInput
              placeholder="Please specify"
              value={other}
              onChange={event => setOther(event.target.value)}
            />
          )}
        </Box>
        <Box width="100%" direction="row" justify="between">
          <Button label="Cancel" onClick={onClose()} />
          <Button
            label="Send"
            primary
            onClick={async () => {
              const Votes = Parse.Object.extend("Votes");
              
              const query = new Parse.Query(Votes);

              onClose()

              const providerSuggestion = provider == 'Other' ? other : provider

              query.equalTo("provider", providerSuggestion);
              const results = await query.find();
              console.log('results: ', results);

              if(results.length == 0){
                const vote = new Votes();
                vote.save({ provider: providerSuggestion, votes: 0 }).then(
                  vote => {
                    console.log(vote);
                  },
                  error => {
                  }
                );
              } else {
                results[0].increment('votes').save()
              }
              
              
            }}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default PopupVoter;
