import { Server } from "./server";
import Parse from "parse";

export class ServerImpl implements Server {
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
