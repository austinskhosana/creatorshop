import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface CreatorBreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function CreatorBreadcrumb({ items }: CreatorBreadcrumbProps) {
  return <Breadcrumb><BreadcrumbList>{items.map((item, index) => <Fragment key={item.label}>{index > 0 ? <BreadcrumbSeparator /> : null}<BreadcrumbItem>{item.href ? <BreadcrumbLink asChild><Link href={item.href}>{item.label}</Link></BreadcrumbLink> : <BreadcrumbPage>{item.label}</BreadcrumbPage>}</BreadcrumbItem></Fragment>)}</BreadcrumbList></Breadcrumb>;
}
import { Fragment } from "react";
