<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205403_rbac_auth_rule extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%rbac_auth_rule}}',
            [
                'name'=> $this->string(64)->notNull(),
                'data'=> $this->text()->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%rbac_auth_rule}}');
    }
}
