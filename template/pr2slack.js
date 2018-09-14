/**
 * 指定したオーナー内でオープンになっている Pull Request の一覧を Slack へ投稿する
 */
function pullRequests() {
  var GITHUB_TOKEN   = "<%= GITHUB_TOKEN %>";
  var GITHUB_OWNER   = "<%= GITHUB_OWNER %>";
  var SLACK_TOKEN    = "<%= SLACK_TOKEN %>";
  var SLACK_BOT_NAME = "<%= SLACK_BOT_NAME %>";
  var SLACK_CHANNEL  = "<%= SLACK_CHANNEL %>";
 
  var repos_res = UrlFetchApp.fetch("https://api.github.com/" + GITHUB_OWNER + "/repos?access_token=" + GITHUB_TOKEN);
  var repos = JSON.parse(repos_res.getContentText());
  var texts = [];
  for ( var i in repos ) {
    var repo = repos[i];
    var prs_res = UrlFetchApp.fetch("https://api.github.com/repos/" + repo.full_name + "/pulls?state=open&access_token=" + GITHUB_TOKEN);
    var prs = JSON.parse(prs_res.getContentText());
    var links = []
    for ( j in prs ) {
      var pr = prs[j];
      var text = "\t<" + pr.html_url + "|#" + pr.number + " " + pr.title + ">";
      links.push(text);
    }
    if (links.length > 0) {
      texts.push("*" + repo.full_name + "*");
      texts.push(links.join("\n"));
      texts.push();
    }
  }
  
  var text = "";
  if (texts.length > 0) {
    text = "オープンになっている Pull Request だよ。";
    text += "\n\n";
    text += texts.join("\n");
  } else {
    text = "オープンになっている Pull Request は無いよ。";
  }
  var slack_res = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage?token=" + SLACK_TOKEN + "&channel=" + SLACK_CHANNEL + "&as_user=false&username=" + encodeURIComponent(SLACK_BOT_NAME) + "&text=" + encodeURIComponent(text));
  var slack_res = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", {
    method: "post",
    payload: {
      token: SLACK_TOKEN,
      channel: SLACK_CHANNEL,
      as_user: false,
      username: SLACK_BOT_NAME,
      text: text,
    },
  });
  Logger.log(slack_res);
}
