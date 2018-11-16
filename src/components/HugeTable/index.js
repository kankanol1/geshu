import React from 'react';
import Clusterize from 'clusterize.js';
import 'clusterize.js/clusterize.css';
import $ from 'jquery';

export default class HugeTable extends React.Component {
  clusterize = undefined;

  componentDidMount() {
    const { data, id } = this.props;
    //
    const $scroll = $(`#${id}-scrollArea`);
    const $content = $(`#${id}-contentArea`);
    const $headers = $(`#${id}-headersArea`);
    // events.
    /**
     * Makes header columns equal width to content columns
     */
    const fitHeaderColumns = () => {
      let prevWidth = [];
      return () => {
        const $firstRow = $content.find('tr:not(.clusterize-extra-row):first');
        const columnsWidth = [];
        $firstRow.children().each(i => {
          // console.log(`=============:${i}`);
          columnsWidth.push($(i).width());
        });
        if (columnsWidth.toString() === prevWidth.toString()) return;
        $headers
          .find('tr')
          .children()
          .each(i => {
            $(i).width(columnsWidth[i]);
          });
        // console.log('width', columnsWidth);
        prevWidth = columnsWidth;
      };
    };

    /**
     * Keep header equal width to tbody
     */
    const setHeaderWidth = () => {
      $headers.width($content.width());
    };

    /**
     * Set left offset to header to keep equal horizontal scroll position
     */
    const setHeaderLeftMargin = scrollLeft => {
      $headers.css('margin-left', -scrollLeft);
    };

    this.clusterize = new Clusterize({
      rows: data,
      scrollId: `${id}-scrollArea`,
      contentId: `${id}-contentArea`,
      callbacks: {
        clusterChanged: () => {
          // console.log('changed');
          fitHeaderColumns();
          setHeaderWidth();
        },
      },
    });

    /**
     * Update header columns width on window resize
     */
    $(window).resize(_ => _.debounce(fitHeaderColumns, 150));

    /**
     * Update header left offset on scroll
     */
    $scroll.on('scroll', () => {
      let prevScrollLeft = 0;
      return () => {
        const scrollLeft = $(this).scrollLeft();
        if (scrollLeft === prevScrollLeft) return;
        prevScrollLeft = scrollLeft;

        setHeaderLeftMargin(scrollLeft);
      };
    });
  }

  render() {
    const { id } = this.props;
    return (
      <div className="clusterize">
        <table id={`${id}-headersArea`}>
          <thead>
            <tr>
              <th>Headers1</th>
              <th>Headers2</th>
              <th>Headers3</th>
              <th>Headers4</th>
              <th>Headers5</th>
              <th>Headers6</th>
              <th>Headers7</th>
              <th>Headers8</th>
              <th>Headers9</th>
              <th>Headers10</th>
              <th>Headers111</th>
            </tr>
          </thead>
        </table>
        <div id={`${id}-scrollArea`} className="clusterize-scroll">
          <table className="">
            <tbody id={`${id}-contentArea`} className="clusterize-content">
              <tr className="clusterize-no-data">
                <td>Loading data…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
