import axios from 'axios';
import cheerio from 'cheerio';
import { CrawlingData } from '../interfaces/crawling';

export const jobkorea = async (keyword: any, page: any) => {
    const res = await axios.get(`https://www.jobkorea.co.kr/Search/?stext=${keyword}&Page_No=${page}`);
    const $ = cheerio.load(res.data);
    const content = $('.list-post');

    const paginationElements = $('.tplPagination.newVer.wide ul li');
    const pagination: number[] = [];
    paginationElements.each((i, el) => {
        const page = $(el).text().trim();
        pagination.push(parseInt(page, 10));
    });

    let jobkoreaData: CrawlingData = { pagination: pagination, searchList: [] };

    content.each((i, el) => {
        const companyName = $(el).find('.post-list-corp .name.dev_view').text().trim();
        const title = $(el).find('.post-list-info .title.dev_view').text().trim();
        const href = $(el).find('.post-list-info .title.dev_view').attr('href');
        const day = $(el).find('.post-list-info .option .date').text().trim();
        const detailOption = {
            area: $(el).find('.post-list-info .option .loc.long').text().trim(),
            career: $(el).find('.post-list-info .option .exp ').text().trim(),
            academic: $(el).find('.post-list-info .option .edu').text().trim(),
            typeOfEmployment: $(el).find('.post-list-info .option span:nth-child(3)').text().trim(),
        };
        const sector = $(el).find('.post-list-info .etc').text().trim();

        if (companyName === '' || title === '') {
            return;
        }

        const data = {
            siteName: '잡코리아 공고',
            companyName: companyName,
            title: title,
            day: day,
            href: 'https://www.jobkorea.co.kr' + href,
            sector: sector
                .split(',')
                .map((item) => item.trim())
                .slice(0, 5),
            detailOption: detailOption,
        };

        jobkoreaData.searchList.push(data);
    });

    return jobkoreaData;
};
