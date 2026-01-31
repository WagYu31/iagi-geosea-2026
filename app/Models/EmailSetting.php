<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailSetting extends Model
{
    protected $fillable = [
        'mail_mailer',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'mail_port' => 'integer',
    ];

    /**
     * Get the active email setting
     */
    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }

    /**
     * Apply email settings to config
     */
    public function applyToConfig()
    {
        config([
            'mail.default' => $this->mail_mailer,
            'mail.mailers.smtp.host' => $this->mail_host,
            'mail.mailers.smtp.port' => $this->mail_port,
            'mail.mailers.smtp.encryption' => $this->mail_encryption,
            'mail.mailers.smtp.username' => $this->mail_username,
            'mail.mailers.smtp.password' => $this->mail_password,
            'mail.from.address' => $this->mail_from_address,
            'mail.from.name' => $this->mail_from_name,
        ]);
    }
}
