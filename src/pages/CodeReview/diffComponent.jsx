import React, { useEffect } from "react";
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui'
import "diff2html/bundles/css/diff2html.min.css";

const DiffComponent = ({ diffText }) => {
  useEffect(() => {
    const targetElement = document.getElementById('diff-output');
    const configuration = {
      drawFileList: true,               // 是否在差异之前显示文件列表
      fileListToggle: false,            // 是否允许切换文件列表的显示
      fileListStartVisible: false,      // 文件列表是否初始时可见
      matching: 'lines',                // 匹配级别：行
      outputFormat: 'side-by-side',     // 并排显示的差异格式
      synchronizedScroll: true,         // 是否同步滚动
      highlight: true,                  // 高亮显示代码
      renderNothingWhenEmpty: false     // 如果没有差异，是否显示空内容
    };
    const diff2htmlUi = new Diff2HtmlUI(targetElement, diffText, configuration);
    diff2htmlUi.draw();
    diff2htmlUi.highlightCode();
  }, [diffText]);

  return (<div id="diff-output"></div>)
}

export default DiffComponent