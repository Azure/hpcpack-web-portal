---
layout: default
---

## About Microsoft HPC Pack

Microsoft HPC Pack(HPC Pack hereafter) is a product of Microsoft for High Performance Computing. It can be deployed on premise or on Azure, with Windows and/or Linux working nodes.

HPC Pack comes with a rich set of tools for submitting jobs and managing the cluster, including desktop GUI, command lines and the __web portal__.

The web portal is accessible at `https://{host}/hpc/portal`, in which the `host` is a HPC Pack head node's name when the cluster has a single head node, or a load balancer name when the cluster has multiple head nodes behind the load balancer.

## Screen Shots

![Dashboard]({{ '/assets/media/Dashboard.png'| relative_url }} "Dashboard")

![Nodes]({{ '/assets/media/Nodes.png'| relative_url }} "Nodes")

![Jobs]({{ '/assets/media/Jobs.png'| relative_url }} "Jobs")

![Charts]({{ '/assets/media/Charts.png'| relative_url }} "Charts")

![Logs]({{ '/assets/media/Logs.png'| relative_url }} "Logs")

## Update the Web Portal

The web portal is a Single Page Application(SPA) and can be updated in a standalone way, out of HPC Pack's release cycle. You can check its releases at [{{ site.github.repository_url }}/releases]({{ site.github.repository_url }}/releases).

To update the portal:
1. Select the release you want to update to, and download the release package, like WebPortal-1.1.16.zip.
2. Replace the portal on head node(s) with your download. The path for portal on head nodes is `%CCP_HOME%bin\WebPortal`, which generally will be expanded to `C:\Program Files\Microsoft HPC Pack 2019\Bin\WebPortal`. You may backup the directory if you'd like to restore it. Then remove all files under the directory and unzip the release package into the directory. If your cluster has multiple head nodes, you need to do this on every one.

That's all. Now reopen your web portal in a browser and you'll see the update. You can validate your new version by accessing `https://{host}/hpc/portal/version`.
