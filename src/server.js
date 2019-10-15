// helper file

import axios from "axios";
import Parse from "parse";

Parse.initialize(
  "osxjLrTMW7cJ6r6IPOpDYXyuBzBRSzQTaNeza7O6",
  "rijTlVRNfqPPV2X9MLnRAP1UDzQbz7UTRjfCOaQ6"
);
Parse.serverURL = 'https://pg-app-57gagyy9xq3pta5kvgpzs2dh6gv7w5.scalabl.cloud/1/';
// Parse.initialize("napchart");
// Parse.serverURL = "http://localhost:1337/1/";

const Chart = Parse.Object.extend("Chart");

export default {
  save: (data, title, description, cb) => {
    var chart = new Chart();

    const results = Parse.Cloud.run("createChart", {
      chartid: "123f5",
      title: title,
      description: description,
      chartData: data
    })
      .then(response => {
        console.log(response);
        var chartid = response.chartid;

        cb(null, chartid);
      })
      .catch(hm => {
        console.error("oh no!:", hm);
        cb("Oh no! There was an error with your request. Please try again");
      });
  },

  loadChart: async (loading, loadFinish, cb) => {
    // first check if fetch is needed
    var chartid = false;
    if (window.location.pathname.length == 6) {
      chartid = window.location.pathname.substring(1);
    }

    if (!chartid) {
      console.log("no chartid, nothing to load");
      return cb({});
    }

    loading();

    const query = new Parse.Query(Chart);
    query.equalTo("chartid", chartid);
    const results = await query.find();
    console.log("results: ", results);
    const chart = results[0];
    console.log();
    const data = {
      id: chartid,
      ...chart.get("chartData"),
      metaInfo: {
        title: chart.get("title"),
        description: chart.get("description")
      },
    };
    loadFinish();

    return cb(data);
  },

  sendFeedback: (feedback, cb) => {
    const Feedback = new Parse.Object.extend("Feedback");
    const fb = new Feedback()

    fb.save({
      feedback
    }).then(response => {
      console.log(response);
      cb();
    });
    // axios
    //   .post("/api/postFeedback", {
    //     data: JSON.stringify(feedback)
    //   })
      
  }
};
