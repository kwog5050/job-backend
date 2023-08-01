import axios from 'axios';
import cheerio from 'cheerio';
import { CrawlingData } from '../interfaces/crawling';

export const saramin = async (keyword: any, page: any) => {
    const res = await axios.get(`https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${keyword}&recruitSort=reg_dt&recruitPage=${page}&mainSearch=n`);
    const $ = cheerio.load(res.data);
    const content = $('.item_recruit');

    const paginationElements = $('.pagination .page');
    const pagination: number[] = [];
    paginationElements.each((i, el) => {
        const page = $(el).text().trim();
        pagination.push(parseInt(page, 10));
    });

    let saraminData: CrawlingData = { pagination: pagination, searchList: [] };

    content.each((i, el) => {
        const companyName = $(el).find('.corp_name a').text().trim();
        const title = $(el).find('.job_tit a span').text().trim();
        const href = $(el).find('.job_tit a').attr('href');
        const day = $(el).find('.job_sector .job_day').text().trim();
        const detailOption = {
            area: `${$(el).find('.job_condition span:nth-child(1) a:nth-child(1)').text().trim()} ${$(el).find('.job_condition span:nth-child(1) a:nth-child(2)').text().trim()}`,
            career: $(el).find('span:nth-child(2)').text().trim(),
            academic: $(el).find('span:nth-child(3)').text().trim(),
            typeOfEmployment: $(el).find('span:nth-child(4)').text().trim(),
        };
        let sector: string[] = [];

        $(el)
            .find('.job_sector a')
            .each((j, sectors) => {
                sector.push($(sectors).text().trim());
            });

        const data = {
            siteName: '사람인 공고',
            companyName: companyName,
            title: title,
            day: day,
            href: 'https://www.saramin.co.kr' + href,
            sector: sector,
            detailOption: detailOption,
        };

        saraminData.searchList.push(data);
    });

    return saraminData;
};
