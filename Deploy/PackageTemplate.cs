namespace TDAshworth.PowerNotify.Deployment
{
    using System.ComponentModel.Composition;
    using Capgemini.Xrm.Deployment.PackageDeployer;
    using Microsoft.Xrm.Tooling.PackageDeployment.CrmPackageExtentionBase;

    /// <summary>
    /// Import package starter frame.
    /// </summary>
    [Export(typeof(IImportExtensions))]
    public class PackageTemplate : CapgeminiPackageTemplate
    {
        /// <inheritdoc/>
        public override string GetImportPackageDataFolderName => "PkgFolder";

        /// <inheritdoc/>
        public override string GetImportPackageDescriptionText => "PowerNotify";

        /// <inheritdoc/>
        public override string GetLongNameOfImport => "PowerNotify";

        /// <inheritdoc/>
        public override string GetNameOfImport(bool plural) => "PowerNotify";
    }
}
