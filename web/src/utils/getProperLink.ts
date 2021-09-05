import slugify from 'slugify';


export const getProperLink = (chartOwner, title, chartid) => {
  const urlTitle = title ? slugify(title) + '-' : '';

  return `/${chartOwner}/${urlTitle}${chartid}`;
};
