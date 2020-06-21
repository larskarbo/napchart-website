import { Server } from "./server";
import Parse from "parse";

export class ServerImpl /*implements Server*/ {
  private static instance: ServerImpl;
  private constructor() {}
  loadChartsForUser(userId: number): Promise<any> {
    return Promise.resolve();
  }

  static getInstance(): ServerImpl {
    if (!ServerImpl.instance) {
      ServerImpl.instance = new ServerImpl();
      Parse.initialize(
        "osxjLrTMW7cJ6r6IPOpDYXyuBzBRSzQTaNeza7O6",
        "rijTlVRNfqPPV2X9MLnRAP1UDzQbz7UTRjfCOaQ6"
      );
      Parse.serverURL =
        "https://pg-app-57gagyy9xq3pta5kvgpzs2dh6gv7w5.scalabl.cloud/1/";
      // Parse.initialize("napchart");
      // Parse.serverURL = "http://localhost:1337/1/";
    }

    return ServerImpl.instance;
  }

  async loadChart(loading: any, loadFinish: any, cb: any) {
    const Chart = Parse.Object.extend("Chart");
    // first check if fetch is needed
    var chartid: any = false;
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
        description: chart.get("description"),
      },
    };
    loadFinish();

    return cb(data);
  }

  sendFeedback(feedback: any, cb: any) {
    if (feedback.length == 0) {
      return;
    }
    const Feedback = new Parse.Object.extend("Feedback");
    const fb = new Feedback();

    fb.save({
      feedback,
    }).then((response) => {
      console.log(response);
      cb(response.id);
    });
    // axios
    //   .post("/api/postFeedback", {
    //     data: JSON.stringify(feedback)
    //   })
  }
  async addEmailToFeedback(email: any, feedbackId: any, cb: any) {
    const Feedback = new Parse.Object.extend("Feedback");
    const query = new Parse.Query(Feedback);
    query.equalTo("objectId", feedbackId);
    console.log("feedbackId: ", feedbackId);
    const results = await query.find();
    console.log("results: ", results);

    results[0].set("email", email);

    results[0].save().then((response) => {
      console.log(response);
      cb();
    });
    // axios
    //   .post("/api/postFeedback", {
    //     data: JSON.stringify(feedback)
    //   })
  }
  save(data: any, title: string, description: string, cb: any) {
    const Chart = Parse.Object.extend("Chart");

    var chart = new Chart();

    const results = Parse.Cloud.run("createChart", {
      chartid: "123f5",
      title: title,
      description: description,
      chartData: data,
    })
      .then((response) => {
        console.log(response);
        var chartid = response.chartid;

        cb(null, chartid);
      })
      .catch((hm) => {
        console.error("oh no!:", hm);
        cb("Oh no! There was an error with your request. Please try again");
      });
  }
}
